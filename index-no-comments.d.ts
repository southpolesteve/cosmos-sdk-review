/// <reference lib="esnext.asynciterable" />

declare interface Agent {
    maxFreeSockets: number;
    maxSockets: number;
    sockets: any;
    requests: any;
    destroy(): void;
}

declare interface AuthOptions {
    key?: string;
    masterKey?: string;
    resourceTokens?: {
        [resourcePath: string]: string;
    };
    tokenProvider?: TokenProvider;
    permissionFeed?: PermissionDefinition[];
}

declare class ChangeFeedIterator<T> {
    private clientContext;
    private resourceId;
    private resourceLink;
    private partitionKey;
    private isPartitionedContainer;
    private changeFeedOptions;
    private static readonly IfNoneMatchAllHeaderValue;
    private nextIfNoneMatch;
    private ifModifiedSince;
    private lastStatusCode;
    private isPartitionSpecified;
    constructor(clientContext: ClientContext, resourceId: string, resourceLink: string, partitionKey: string | number | boolean, isPartitionedContainer: () => Promise<boolean>, changeFeedOptions: ChangeFeedOptions);
    readonly hasMoreResults: boolean;
    getAsyncIterator(): AsyncIterable<ChangeFeedResponse<Array<T & Resource>>>;
    executeNext(): Promise<ChangeFeedResponse<Array<T & Resource>>>;
    private getFeedResponse;
}

declare interface ChangeFeedOptions {
    maxItemCount?: number;
    continuation?: string;
    sessionToken?: string;
    startFromBeginning?: boolean;
    startTime?: Date;
}

declare class ChangeFeedResponse<T> {
    readonly result: T;
    readonly count: number;
    readonly statusCode: number;
    constructor(result: T, count: number, statusCode: number, headers: CosmosHeaders);
    readonly requestCharge: number;
    readonly activityId: string;
    readonly continuation: string;
    readonly sessionToken: string;
    readonly etag: string;
    headers: CosmosHeaders;
}

declare class ClientContext {
    private cosmosClientOptions;
    private globalEndpointManager;
    private readonly sessionContainer;
    private connectionPolicy;
    partitionKeyDefinitionCache: {
        [containerUrl: string]: any;
    };
    constructor(cosmosClientOptions: CosmosClientOptions, globalEndpointManager: GlobalEndpointManager);
    read<T>(path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & Resource>>;
    queryFeed<T>(path: string, resourceType: ResourceType, resourceId: string, resultFn: (result: {
        [key: string]: any;
    }) => any[], query: SqlQuerySpec | string, options: FeedOptions, partitionKeyRangeId?: string): Promise<Response<T & Resource>>;
    queryPartitionKeyRanges(collectionLink: string, query?: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<PartitionKeyRange>;
    delete<T>(path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & Resource>>;
    create<T, U = T>(body: T, path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & U & Resource>>;
    private processQueryFeedResponse;
    private applySessionToken;
    replace<T>(body: any, path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & Resource>>;
    upsert<T, U = T>(body: T, path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & U & Resource>>;
    execute<T>(sprocLink: string, params?: any[], options?: RequestOptions): Promise<Response<T>>;
    getDatabaseAccount(options?: RequestOptions): Promise<Response<DatabaseAccount>>;
    getWriteEndpoint(): Promise<string>;
    getReadEndpoint(): Promise<string>;
    private captureSessionToken;
    clearSessionToken(path: string): void;
    private getSessionParams;
    private isMasterResource;
    private buildHeaders;
}

export declare class ClientSideMetrics {
    readonly requestCharge: number;
    constructor(requestCharge: number);
    add(...clientSideMetricsArray: ClientSideMetrics[]): ClientSideMetrics;
    static readonly zero: ClientSideMetrics;
    static createFromArray(...clientSideMetricsArray: ClientSideMetrics[]): ClientSideMetrics;
}

declare type CompareFunction = (x: Point, y: Point) => number;

export declare class Conflict {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    readonly url: string;
    constructor(container: Container, id: string, clientContext: ClientContext);
    read(options?: RequestOptions): Promise<ConflictResponse>;
    delete(options?: RequestOptions): Promise<ConflictResponse>;
}

export declare interface ConflictDefinition {
    id?: string;
    resourceId?: string;
    resourceType?: ResourceType;
    operationType?: OperationType;
    content?: string;
}

export declare enum ConflictResolutionMode {
    Custom = "Custom",
    LastWriterWins = "LastWriterWins"
}

export declare interface ConflictResolutionPolicy {
    mode?: keyof typeof ConflictResolutionMode;
    conflictResolutionPath?: string;
    conflictResolutionProcedure?: string;
}

export declare class ConflictResponse extends ResourceResponse<ConflictDefinition & Resource> {
    constructor(resource: ConflictDefinition & Resource, headers: CosmosHeaders, statusCode: number, conflict: Conflict);
    readonly conflict: Conflict;
}

export declare class Conflicts {
    readonly container: Container;
    private readonly clientContext;
    constructor(container: Container, clientContext: ClientContext);
    query(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<ConflictDefinition & Resource>;
}

export declare enum ConnectionMode {
    Gateway = 0
}

export declare interface ConnectionPolicy {
    connectionMode?: ConnectionMode;
    requestTimeout?: number;
    enableEndpointDiscovery?: boolean;
    preferredLocations?: string[];
    retryOptions?: RetryOptions;
    disableSSLVerification?: boolean;
    useMultipleWriteLocations?: boolean;
}

export declare enum ConsistencyLevel {
    Strong = "Strong",
    BoundedStaleness = "BoundedStaleness",
    Session = "Session",
    Eventual = "Eventual",
    ConsistentPrefix = "ConsistentPrefix"
}

export declare const Constants: {
    MediaTypes: {
        Any: string;
        ImageJpeg: string;
        ImagePng: string;
        Javascript: string;
        Json: string;
        OctetStream: string;
        QueryJson: string;
        SQL: string;
        TextHtml: string;
        TextPlain: string;
        Xml: string;
    };
    HttpHeaders: {
        Authorization: string;
        ETag: string;
        MethodOverride: string;
        Slug: string;
        ContentType: string;
        LastModified: string;
        ContentEncoding: string;
        CharacterSet: string;
        UserAgent: string;
        IfModifiedSince: string;
        IfMatch: string;
        IfNoneMatch: string;
        ContentLength: string;
        AcceptEncoding: string;
        KeepAlive: string;
        CacheControl: string;
        TransferEncoding: string;
        ContentLanguage: string;
        ContentLocation: string;
        ContentMd5: string;
        ContentRange: string;
        Accept: string;
        AcceptCharset: string;
        AcceptLanguage: string;
        IfRange: string;
        IfUnmodifiedSince: string;
        MaxForwards: string;
        ProxyAuthorization: string;
        AcceptRanges: string;
        ProxyAuthenticate: string;
        RetryAfter: string;
        SetCookie: string;
        WwwAuthenticate: string;
        Origin: string;
        Host: string;
        AccessControlAllowOrigin: string;
        AccessControlAllowHeaders: string;
        KeyValueEncodingFormat: string;
        WrapAssertionFormat: string;
        WrapAssertion: string;
        WrapScope: string;
        SimpleToken: string;
        HttpDate: string;
        Prefer: string;
        Location: string;
        Referer: string;
        A_IM: string;
        Query: string;
        IsQuery: string;
        Continuation: string;
        PageSize: string;
        ItemCount: string;
        ActivityId: string;
        PreTriggerInclude: string;
        PreTriggerExclude: string;
        PostTriggerInclude: string;
        PostTriggerExclude: string;
        IndexingDirective: string;
        SessionToken: string;
        ConsistencyLevel: string;
        XDate: string;
        CollectionPartitionInfo: string;
        CollectionServiceInfo: string;
        RetryAfterInMilliseconds: string;
        IsFeedUnfiltered: string;
        ResourceTokenExpiry: string;
        EnableScanInQuery: string;
        EmitVerboseTracesInQuery: string;
        EnableCrossPartitionQuery: string;
        ParallelizeCrossPartitionQuery: string;
        PopulateQueryMetrics: string;
        QueryMetrics: string;
        Version: string;
        OwnerFullName: string;
        OwnerId: string;
        PartitionKey: string;
        PartitionKeyRangeID: string;
        MaxEntityCount: string;
        CurrentEntityCount: string;
        CollectionQuotaInMb: string;
        CollectionCurrentUsageInMb: string;
        MaxMediaStorageUsageInMB: string;
        CurrentMediaStorageUsageInMB: string;
        RequestCharge: string;
        PopulateQuotaInfo: string;
        MaxResourceQuota: string;
        OfferType: string;
        OfferThroughput: string;
        DisableRUPerMinuteUsage: string;
        IsRUPerMinuteUsed: string;
        OfferIsRUPerMinuteThroughputEnabled: string;
        IndexTransformationProgress: string;
        LazyIndexingProgress: string;
        IsUpsert: string;
        SubStatus: string;
        EnableScriptLogging: string;
        ScriptLogResults: string;
        ALLOW_MULTIPLE_WRITES: string;
    };
    WritableLocations: string;
    ReadableLocations: string;
    Name: string;
    DatabaseAccountEndpoint: string;
    ENABLE_MULTIPLE_WRITABLE_LOCATIONS: string;
    DefaultUnavailableLocationExpirationTimeMS: number;
    ThrottleRetryCount: string;
    ThrottleRetryWaitTimeInMs: string;
    CurrentVersion: string;
    SDKName: string;
    SDKVersion: string;
    DefaultPrecisions: {
        DefaultNumberHashPrecision: number;
        DefaultNumberRangePrecision: number;
        DefaultStringHashPrecision: number;
        DefaultStringRangePrecision: number;
    };
    ConsistentHashRing: {
        DefaultVirtualNodesPerCollection: number;
    };
    RegularExpressions: {
        TrimLeftSlashes: RegExp;
        TrimRightSlashes: RegExp;
        IllegalResourceIdCharacters: RegExp;
    };
    Quota: {
        CollectionSize: string;
    };
    Path: {
        DatabasesPathSegment: string;
        CollectionsPathSegment: string;
        UsersPathSegment: string;
        DocumentsPathSegment: string;
        PermissionsPathSegment: string;
        StoredProceduresPathSegment: string;
        TriggersPathSegment: string;
        UserDefinedFunctionsPathSegment: string;
        ConflictsPathSegment: string;
        AttachmentsPathSegment: string;
        PartitionKeyRangesPathSegment: string;
        SchemasPathSegment: string;
        OffersPathSegment: string;
        TopologyPathSegment: string;
        DatabaseAccountPathSegment: string;
    };
    PartitionKeyRange: {
        MinInclusive: string;
        MaxExclusive: string;
        Id: string;
    };
    QueryRangeConstants: {
        MinInclusive: string;
        MaxExclusive: string;
        min: string;
    };
    EffectiveParitionKeyConstants: {
        MinimumInclusiveEffectivePartitionKey: string;
        MaximumExclusiveEffectivePartitionKey: string;
    };
};

export declare class Container {
    readonly database: Database;
    readonly id: string;
    private readonly clientContext;
    private $items;
    readonly items: Items;
    private $scripts;
    readonly scripts: Scripts;
    private $conflicts;
    readonly conflicts: Conflicts;
    readonly url: string;
    constructor(database: Database, id: string, clientContext: ClientContext);
    item(id: string, partitionKey?: string): Item;
    conflict(id: string): Conflict;
    read(options?: RequestOptions): Promise<ContainerResponse>;
    replace(body: ContainerDefinition, options?: RequestOptions): Promise<ContainerResponse>;
    delete(options?: RequestOptions): Promise<ContainerResponse>;
    getPartitionKeyDefinition(): Promise<ResourceResponse<PartitionKeyDefinition>>;
    readPartitionKeyRanges(feedOptions?: FeedOptions): QueryIterator<PartitionKeyRange>;
}

export declare interface ContainerDefinition {
    id?: string;
    partitionKey?: PartitionKeyDefinition;
    indexingPolicy?: IndexingPolicy;
    defaultTtl?: number;
    conflictResolutionPolicy?: ConflictResolutionPolicy;
    uniqueKeyPolicy?: UniqueKeyPolicy;
}

declare interface ContainerRequest extends ContainerDefinition {
    throughput?: number;
}

export declare class ContainerResponse extends ResourceResponse<ContainerDefinition & Resource> {
    constructor(resource: ContainerDefinition & Resource, headers: CosmosHeaders, statusCode: number, container: Container);
    readonly container: Container;
}

export declare class Containers {
    readonly database: Database;
    private readonly clientContext;
    constructor(database: Database, clientContext: ClientContext);
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    create(body: ContainerRequest, options?: RequestOptions): Promise<ContainerResponse>;
    createIfNotExists(body: ContainerRequest, options?: RequestOptions): Promise<ContainerResponse>;
    readAll(options?: FeedOptions): QueryIterator<ContainerDefinition & Resource>;
}

export declare class CosmosClient {
    private options;
    readonly databases: Databases;
    readonly offers: Offers;
    private clientContext;
    constructor(options: CosmosClientOptions);
    getDatabaseAccount(options?: RequestOptions): Promise<ResourceResponse<DatabaseAccount>>;
    getWriteEndpoint(): Promise<string>;
    getReadEndpoint(): Promise<string>;
    database(id: string): Database;
    offer(id: string): Offer;
}

export declare interface CosmosClientOptions {
    endpoint: string;
    key?: string;
    auth?: AuthOptions;
    connectionPolicy?: ConnectionPolicy;
    consistencyLevel?: keyof typeof ConsistencyLevel;
    defaultHeaders?: CosmosHeaders_2;
    agent?: Agent;
    plugins?: PluginConfig[];
}

export declare interface CosmosHeaders {
    [key: string]: any;
}

declare interface CosmosHeaders_2 {
    [key: string]: string | boolean | number;
}

export declare enum DataType {
    Number = "Number",
    String = "String",
    Point = "Point",
    LineString = "LineString",
    Polygon = "Polygon",
    MultiPolygon = "MultiPolygon"
}

export declare class Database {
    readonly client: CosmosClient;
    readonly id: string;
    private clientContext;
    readonly containers: Containers;
    readonly users: Users;
    readonly url: string;
    constructor(client: CosmosClient, id: string, clientContext: ClientContext);
    container(id: string): Container;
    user(id: string): User;
    read(options?: RequestOptions): Promise<DatabaseResponse>;
    delete(options?: RequestOptions): Promise<DatabaseResponse>;
}

export declare class DatabaseAccount {
    readonly writableLocations: Location[];
    readonly readableLocations: Location[];
    readonly DatabasesLink: string;
    readonly MediaLink: string;
    readonly MaxMediaStorageUsageInMB: number;
    readonly CurrentMediaStorageUsageInMB: number;
    readonly ConsistencyPolicy: ConsistencyLevel;
    readonly enableMultipleWritableLocations: boolean;
    constructor(body: {
        [key: string]: any;
    }, headers: CosmosHeaders);
}

export declare interface DatabaseDefinition {
    id?: string;
}

declare interface DatabaseRequest extends DatabaseDefinition {
    throughput?: number;
}

export declare class DatabaseResponse extends ResourceResponse<DatabaseDefinition & Resource> {
    constructor(resource: DatabaseDefinition & Resource, headers: CosmosHeaders, statusCode: number, database: Database);
    readonly database: Database;
}

export declare class Databases {
    readonly client: CosmosClient;
    private readonly clientContext;
    constructor(client: CosmosClient, clientContext: ClientContext);
    query(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    create(body: DatabaseRequest, options?: RequestOptions): Promise<DatabaseResponse>;
    createIfNotExists(body: DatabaseRequest, options?: RequestOptions): Promise<DatabaseResponse>;
    readAll(options?: FeedOptions): QueryIterator<DatabaseDefinition & Resource>;
}

declare interface ErrorBody {
    code: string;
    message: string;
    additionalErrorInfo?: PartitionedQueryExecutionInfo;
}

export declare interface ErrorResponse {
    code?: number;
    substatus?: number;
    body?: ErrorBody;
    headers?: CosmosHeaders;
    activityId?: string;
    retryAfterInMilliseconds?: number;
    [key: string]: any;
}

export declare interface FeedOptions extends SharedOptions {
    continuation?: string;
    disableRUPerMinuteUsage?: boolean;
    enableCrossPartitionQuery?: boolean;
    enableScanInQuery?: boolean;
    maxDegreeOfParallelism?: number;
    maxItemCount?: number;
    useIncrementalFeed?: boolean;
    accessCondition?: {
        type: string;
        condition: string;
    };
    populateQueryMetrics?: boolean;
}

export declare class FeedResponse<TResource> {
    readonly resources: TResource[];
    private readonly headers;
    readonly hasMoreResults: boolean;
    constructor(resources: TResource[], headers: CosmosHeaders, hasMoreResults: boolean);
    readonly continuation: string;
    readonly queryMetrics: string;
    readonly requestCharge: number;
    readonly activityId: string;
}

declare type FetchFunctionCallback = (options: any) => Promise<Response<any>>;

declare class GlobalEndpointManager {
    private readDatabaseAccount;
    private defaultEndpoint;
    enableEndpointDiscovery: boolean;
    private isEndpointCacheInitialized;
    private locationCache;
    private isRefreshing;
    private readonly backgroundRefreshTimeIntervalInMS;
    constructor(options: CosmosClientOptions, readDatabaseAccount: (opts: RequestOptions) => Promise<ResourceResponse<DatabaseAccount>>);
    getReadEndpoint(): Promise<string>;
    getWriteEndpoint(): Promise<string>;
    getReadEndpoints(): Promise<ReadonlyArray<string>>;
    getWriteEndpoints(): Promise<ReadonlyArray<string>>;
    markCurrentLocationUnavailableForRead(endpoint: string): void;
    markCurrentLocationUnavailableForWrite(endpoint: string): void;
    canUseMultipleWriteLocations(resourceType?: ResourceType, operationType?: OperationType): boolean;
    resolveServiceEndpoint(request: RequestContext): Promise<string>;
    refreshEndpointList(): Promise<void>;
    private backgroundRefresh;
    private getDatabaseAccountFromAnyEndpoint;
    private static getLocationalEndpoint;
}

declare enum HTTPMethod {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = "DELETE"
}

export declare interface Index {
    kind: keyof typeof IndexKind;
    dataType: keyof typeof DataType;
    precision?: number;
}

export declare enum IndexKind {
    Hash = "Hash",
    Range = "Range",
    Spatial = "Spatial"
}

export declare interface IndexedPath {
    path: string;
    indexes?: Index[];
}

export declare enum IndexingMode {
    consistent = "consistent",
    lazy = "lazy",
    none = "none"
}

export declare interface IndexingPolicy {
    indexingMode?: keyof typeof IndexingMode;
    automatic?: boolean;
    includedPaths?: IndexedPath[];
    excludedPaths?: IndexedPath[];
}

export declare class Item {
    readonly container: Container;
    readonly id: string;
    readonly partitionKey: string;
    private readonly clientContext;
    readonly url: string;
    constructor(container: Container, id: string, partitionKey: string, clientContext: ClientContext);
    read(options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    read<T extends ItemDefinition>(options?: RequestOptions): Promise<ItemResponse<T>>;
    replace(body: ItemDefinition, options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    replace<T extends ItemDefinition>(body: T, options?: RequestOptions): Promise<ItemResponse<T>>;
    delete(options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    delete<T extends ItemDefinition>(options?: RequestOptions): Promise<ItemResponse<T>>;
}

export declare interface ItemDefinition {
    [key: string]: any;
}

export declare class ItemResponse<T extends ItemDefinition> extends ResourceResponse<T & Resource> {
    constructor(resource: T & Resource, headers: CosmosHeaders, statusCode: number, item: Item);
    readonly item: Item;
}

export declare class Items {
    readonly container: Container;
    private readonly clientContext;
    constructor(container: Container, clientContext: ClientContext);
    query(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readChangeFeed(partitionKey: string | number | boolean, changeFeedOptions: ChangeFeedOptions): ChangeFeedIterator<any>;
    readChangeFeed(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<any>;
    readChangeFeed<T>(partitionKey: string | number | boolean, changeFeedOptions: ChangeFeedOptions): ChangeFeedIterator<T>;
    readChangeFeed<T>(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<ItemDefinition>;
    readAll<T extends ItemDefinition>(options?: FeedOptions): QueryIterator<T>;
    create<T extends ItemDefinition = any>(body: T, options?: RequestOptions): Promise<ItemResponse<T>>;
    upsert(body: any, options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    upsert<T extends ItemDefinition>(body: T, options?: RequestOptions): Promise<ItemResponse<T>>;
}

export declare interface Location {
    name: string;
    databaseAccountEndpoint: string;
}

declare class LocationRouting {
    private pIgnorePreferredLocation;
    private pLocationIndexToRoute;
    private pLocationEndpointToRoute;
    readonly ignorePreferredLocation: boolean;
    readonly locationIndexToRoute: number;
    readonly locationEndpointToRoute: string;
    routeToLocation(locationEndpoint: string): void;
    routeToLocation(locationIndex: number, ignorePreferredLocation: boolean): void;
    clearRouteToLocation(): void;
}

export declare type Next<T> = (context: RequestContext) => Promise<Response<T>>;

export declare class Offer {
    readonly client: CosmosClient;
    readonly id: string;
    private readonly clientContext;
    readonly url: string;
    constructor(client: CosmosClient, id: string, clientContext: ClientContext);
    read(options?: RequestOptions): Promise<OfferResponse>;
    replace(body: OfferDefinition, options?: RequestOptions): Promise<OfferResponse>;
}

export declare interface OfferDefinition {
    id?: string;
    offerType?: string;
    offerVersion?: string;
    resource?: string;
    offerResourceId?: string;
    content?: {
        offerThroughput: number;
        offerIsRUPerMinuteThroughputEnabled: boolean;
    };
}

export declare class OfferResponse extends ResourceResponse<OfferDefinition & Resource> {
    constructor(resource: OfferDefinition & Resource, headers: CosmosHeaders, statusCode: number, offer: Offer);
    readonly offer: Offer;
}

export declare class Offers {
    readonly client: CosmosClient;
    private readonly clientContext;
    constructor(client: CosmosClient, clientContext: ClientContext);
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<OfferDefinition & Resource>;
}

declare enum OperationType {
    Create = "create",
    Replace = "replace",
    Upsert = "upsert",
    Delete = "delete",
    Read = "read",
    Query = "query",
    Execute = "execute"
}

export declare type PartitionKey = PartitionKeyDefinition | Point | Range;

export declare interface PartitionKeyDefinition {
    paths: string[];
    kind: keyof typeof PartitionKind;
    version?: number;
}

export declare interface PartitionKeyRange {
    id: string;
    minInclusive: string;
    maxExclusive: string;
    ridPrefix: number;
    throughputFraction: number;
    status: string;
    parents: string[];
}

export declare enum PartitionKind {
    Hash = "Hash"
}

declare interface PartitionedQueryExecutionInfo {
    partitionedQueryExecutionInfoVersion: number;
    queryInfo: QueryInfo;
    queryRanges: QueryRange[];
}

export declare class Permission {
    readonly user: User;
    readonly id: string;
    private readonly clientContext;
    readonly url: string;
    constructor(user: User, id: string, clientContext: ClientContext);
    read(options?: RequestOptions): Promise<PermissionResponse>;
    replace(body: PermissionDefinition, options?: RequestOptions): Promise<PermissionResponse>;
    delete(options?: RequestOptions): Promise<PermissionResponse>;
}

declare interface PermissionBody {
    _token: string;
}

export declare interface PermissionDefinition {
    id: string;
    permissionMode: PermissionMode;
    resource: string;
    resourcePartitionKey?: string | any[];
}

export declare enum PermissionMode {
    None = "none",
    Read = "read",
    All = "all"
}

export declare class PermissionResponse extends ResourceResponse<PermissionDefinition & PermissionBody & Resource> {
    constructor(resource: PermissionDefinition & PermissionBody & Resource, headers: CosmosHeaders, statusCode: number, permission: Permission);
    readonly permission: Permission;
}

export declare class Permissions {
    readonly user: User;
    private readonly clientContext;
    constructor(user: User, clientContext: ClientContext);
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<PermissionDefinition & Resource>;
    create(body: PermissionDefinition, options?: RequestOptions): Promise<PermissionResponse>;
    upsert(body: PermissionDefinition, options?: RequestOptions): Promise<PermissionResponse>;
}

export declare type Plugin<T> = (context: RequestContext, next: Next<T>) => Promise<Response<T>>;

export declare interface PluginConfig {
    on: keyof typeof PluginOn;
    plugin: Plugin<any>;
}

export declare enum PluginOn {
    request = "request",
    operation = "operation"
}

declare type Point = number | string;

declare interface QueryInfo {
    top?: any;
    orderBy?: any[];
    orderByExpressions?: any[];
    offset?: number;
    limit?: number;
    aggregates?: any[];
    rewrittenQuery?: any;
    distinctType: string;
}

export declare class QueryIterator<T> {
    private clientContext;
    private query;
    private options;
    private fetchFunctions;
    private resourceLink?;
    private fetchAllTempResources;
    private fetchAllLastResHeaders;
    private queryExecutionContext;
    constructor(clientContext: ClientContext, query: SqlQuerySpec | string, options: FeedOptions, fetchFunctions: FetchFunctionCallback | FetchFunctionCallback[], resourceLink?: string);
    forEach(callback: (result: T, headers?: CosmosHeaders, index?: number) => boolean | void): Promise<void>;
    getAsyncIterator(): AsyncIterable<FeedResponse<T>>;
    hasMoreResults(): boolean;
    fetchAll(): Promise<FeedResponse<T>>;
    fetchNext(): Promise<FeedResponse<T>>;
    reset(): void;
    private toArrayImplementation;
    private createQueryExecutionContext;
}

export declare class QueryMetrics {
    readonly retrievedDocumentCount: number;
    readonly retrievedDocumentSize: number;
    readonly outputDocumentCount: number;
    readonly outputDocumentSize: number;
    readonly indexHitDocumentCount: number;
    readonly totalQueryExecutionTime: TimeSpan;
    readonly queryPreparationTimes: QueryPreparationTimes;
    readonly indexLookupTime: TimeSpan;
    readonly documentLoadTime: TimeSpan;
    readonly vmExecutionTime: TimeSpan;
    readonly runtimeExecutionTimes: RuntimeExecutionTimes;
    readonly documentWriteTime: TimeSpan;
    readonly clientSideMetrics: ClientSideMetrics;
    constructor(retrievedDocumentCount: number, retrievedDocumentSize: number, outputDocumentCount: number, outputDocumentSize: number, indexHitDocumentCount: number, totalQueryExecutionTime: TimeSpan, queryPreparationTimes: QueryPreparationTimes, indexLookupTime: TimeSpan, documentLoadTime: TimeSpan, vmExecutionTime: TimeSpan, runtimeExecutionTimes: RuntimeExecutionTimes, documentWriteTime: TimeSpan, clientSideMetrics: ClientSideMetrics);
    readonly indexHitRatio: number;
    add(queryMetricsArray: QueryMetrics[]): QueryMetrics;
    toDelimitedString(): string;
    static readonly zero: QueryMetrics;
    static createFromArray(queryMetricsArray: QueryMetrics[]): QueryMetrics;
    static createFromDelimitedString(delimitedString: string, clientSideMetrics?: ClientSideMetrics): QueryMetrics;
}

export declare const QueryMetricsConstants: {
    RetrievedDocumentCount: string;
    RetrievedDocumentSize: string;
    OutputDocumentCount: string;
    OutputDocumentSize: string;
    IndexHitRatio: string;
    IndexHitDocumentCount: string;
    TotalQueryExecutionTimeInMs: string;
    QueryCompileTimeInMs: string;
    LogicalPlanBuildTimeInMs: string;
    PhysicalPlanBuildTimeInMs: string;
    QueryOptimizationTimeInMs: string;
    IndexLookupTimeInMs: string;
    DocumentLoadTimeInMs: string;
    VMExecutionTimeInMs: string;
    DocumentWriteTimeInMs: string;
    QueryEngineTimes: string;
    SystemFunctionExecuteTimeInMs: string;
    UserDefinedFunctionExecutionTimeInMs: string;
    RetrievedDocumentCountText: string;
    RetrievedDocumentSizeText: string;
    OutputDocumentCountText: string;
    OutputDocumentSizeText: string;
    IndexUtilizationText: string;
    TotalQueryExecutionTimeText: string;
    QueryPreparationTimesText: string;
    QueryCompileTimeText: string;
    LogicalPlanBuildTimeText: string;
    PhysicalPlanBuildTimeText: string;
    QueryOptimizationTimeText: string;
    QueryEngineTimesText: string;
    IndexLookupTimeText: string;
    DocumentLoadTimeText: string;
    WriteOutputTimeText: string;
    RuntimeExecutionTimesText: string;
    TotalExecutionTimeText: string;
    SystemFunctionExecuteTimeText: string;
    UserDefinedFunctionExecutionTimeText: string;
    ClientSideQueryMetricsText: string;
    RetriesText: string;
    RequestChargeText: string;
    FetchExecutionRangesText: string;
    SchedulingMetricsText: string;
};

export declare class QueryPreparationTimes {
    readonly queryCompilationTime: TimeSpan;
    readonly logicalPlanBuildTime: TimeSpan;
    readonly physicalPlanBuildTime: TimeSpan;
    readonly queryOptimizationTime: TimeSpan;
    constructor(queryCompilationTime: TimeSpan, logicalPlanBuildTime: TimeSpan, physicalPlanBuildTime: TimeSpan, queryOptimizationTime: TimeSpan);
    add(...queryPreparationTimesArray: QueryPreparationTimes[]): QueryPreparationTimes;
    toDelimitedString(): string;
    static readonly zero: QueryPreparationTimes;
    static createFromArray(queryPreparationTimesArray: QueryPreparationTimes[]): QueryPreparationTimes;
    static createFromDelimitedString(delimitedString: string): QueryPreparationTimes;
}

declare interface QueryRange {
    min: string;
    max: string;
    isMinInclusive: boolean;
    isMaxInclusive: boolean;
}

declare class Range {
    readonly low: Point;
    readonly high: Point;
    constructor(options?: any);
    _compare(x: Point, y: Point, compareFunction?: CompareFunction): number;
    _contains: (other: string | number | Range, compareFunction?: CompareFunction) => boolean;
    contains(other: Point | Range, compareFunction?: CompareFunction): boolean;
    _containsPoint(point: Point, compareFunction?: CompareFunction): boolean;
    _containsRange(range: Range, compareFunction?: CompareFunction): boolean;
    _intersect: (range: Range, compareFunction?: CompareFunction) => boolean;
    intersect(range: Range, compareFunction?: CompareFunction): boolean;
    _toString: () => string;
    toString(): string;
    static _isRange: typeof Range.isRange;
    static isRange(pointOrRange: Point | Range | PartitionKey): boolean;
}

export declare interface RequestContext {
    path?: string;
    operationType?: OperationType;
    client?: ClientContext;
    retryCount?: number;
    resourceType?: ResourceType;
    resourceId?: string;
    locationRouting?: LocationRouting;
    globalEndpointManager: GlobalEndpointManager;
    connectionPolicy: ConnectionPolicy;
    requestAgent: Agent;
    body?: any;
    headers?: CosmosHeaders_2;
    endpoint?: string;
    method: HTTPMethod;
    partitionKeyRangeId?: string;
    options: FeedOptions | RequestOptions;
    plugins: PluginConfig[];
}

declare interface RequestInfo {
    verb: HTTPMethod;
    path: string;
    resourceId: string;
    resourceType: ResourceType;
    headers: CosmosHeaders;
}

export declare interface RequestOptions extends SharedOptions {
    accessCondition?: {
        type: string;
        condition: string;
    };
    consistencyLevel?: string;
    disableRUPerMinuteUsage?: boolean;
    enableScriptLogging?: boolean;
    indexingDirective?: string;
    offerThroughput?: number;
    offerType?: string;
    populateQuotaInfo?: boolean;
    postTriggerInclude?: string | string[];
    preTriggerInclude?: string | string[];
    resourceTokenExpirySeconds?: number;
    urlConnection?: string;
    skipGetPartitionKeyDefinition?: boolean;
    disableAutomaticIdGeneration?: boolean;
}

export declare interface Resource {
    id: string;
    _rid: string;
    _ts: number;
    _self: string;
    _etag: string;
}

export declare class ResourceResponse<TResource> {
    readonly resource: TResource;
    readonly headers: CosmosHeaders_2;
    readonly statusCode: StatusCode;
    constructor(resource: TResource, headers: CosmosHeaders_2, statusCode: StatusCode);
    readonly requestCharge: number;
    readonly activityId: string;
    readonly etag: string;
}

declare enum ResourceType {
    none = "",
    database = "dbs",
    offer = "offers",
    user = "users",
    permission = "permissions",
    container = "colls",
    conflicts = "conflicts",
    sproc = "sprocs",
    udf = "udfs",
    trigger = "triggers",
    item = "docs",
    pkranges = "pkranges"
}

export declare interface Response<T> {
    headers: CosmosHeaders;
    result?: T;
    statusCode?: number;
}

export declare interface RetryOptions {
    maxRetryAttemptCount: number;
    fixedRetryIntervalInMilliseconds: number;
    maxWaitTimeInSeconds: number;
}

export declare class RuntimeExecutionTimes {
    readonly queryEngineExecutionTime: TimeSpan;
    readonly systemFunctionExecutionTime: TimeSpan;
    readonly userDefinedFunctionExecutionTime: TimeSpan;
    constructor(queryEngineExecutionTime: TimeSpan, systemFunctionExecutionTime: TimeSpan, userDefinedFunctionExecutionTime: TimeSpan);
    add(...runtimeExecutionTimesArray: RuntimeExecutionTimes[]): RuntimeExecutionTimes;
    toDelimitedString(): string;
    static readonly zero: RuntimeExecutionTimes;
    static createFromArray(runtimeExecutionTimesArray: RuntimeExecutionTimes[]): RuntimeExecutionTimes;
    static createFromDelimitedString(delimitedString: string): RuntimeExecutionTimes;
}

declare class Scripts {
    readonly container: Container;
    private readonly clientContext;
    constructor(container: Container, clientContext: ClientContext);
    storedProcedure(id: string): StoredProcedure;
    trigger(id: string): Trigger;
    userDefinedFunction(id: string): UserDefinedFunction;
    private $sprocs;
    readonly storedProcedures: StoredProcedures;
    private $triggers;
    readonly triggers: Triggers;
    private $udfs;
    readonly userDefinedFunctions: UserDefinedFunctions;
}

declare interface SharedOptions {
    partitionKey?: PartitionKey | PartitionKey[];
    sessionToken?: string;
    initialHeaders?: CosmosHeaders;
    abortSignal?: AbortSignal;
}

export declare interface SqlParameter {
    name: string;
    value: string | number | boolean;
}

export declare interface SqlQuerySpec {
    query: string;
    parameters?: SqlParameter[];
}

declare const StatusCode: {
    Ok: 200;
    Created: 201;
    Accepted: 202;
    NoContent: 204;
    NotModified: 304;
    BadRequest: 400;
    Unauthorized: 401;
    Forbidden: 403;
    NotFound: 404;
    MethodNotAllowed: 405;
    RequestTimeout: 408;
    Conflict: 409;
    Gone: 410;
    PreconditionFailed: 412;
    RequestEntityTooLarge: 413;
    TooManyRequests: 429;
    RetryWith: 449;
    InternalServerError: 500;
    ServiceUnavailable: 503;
    OperationPaused: 1200;
    OperationCancelled: number;
};

declare type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];

export declare class StoredProcedure {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    readonly url: string;
    constructor(container: Container, id: string, clientContext: ClientContext);
    read(options?: RequestOptions): Promise<StoredProcedureResponse>;
    replace(body: StoredProcedureDefinition, options?: RequestOptions): Promise<StoredProcedureResponse>;
    delete(options?: RequestOptions): Promise<StoredProcedureResponse>;
    execute(params?: any[], options?: RequestOptions): Promise<ResourceResponse<any>>;
    execute<T>(params?: any[], options?: RequestOptions): Promise<ResourceResponse<T>>;
}

export declare interface StoredProcedureDefinition {
    id?: string;
    body?: string | ((...inputs: any[]) => void);
}

export declare class StoredProcedureResponse extends ResourceResponse<StoredProcedureDefinition & Resource> {
    constructor(resource: StoredProcedureDefinition & Resource, headers: CosmosHeaders, statusCode: number, storedProcedure: StoredProcedure);
    readonly storedProcedure: StoredProcedure;
    readonly sproc: StoredProcedure;
}

export declare class StoredProcedures {
    readonly container: Container;
    private readonly clientContext;
    constructor(container: Container, clientContext: ClientContext);
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<StoredProcedureDefinition & Resource>;
    create(body: StoredProcedureDefinition, options?: RequestOptions): Promise<StoredProcedureResponse>;
    upsert(body: StoredProcedureDefinition, options?: RequestOptions): Promise<StoredProcedureResponse>;
}

export declare class TimeSpan {
    protected _ticks: number;
    constructor(days: number, hours: number, minutes: number, seconds: number, milliseconds: number);
    add(ts: TimeSpan): TimeSpan;
    subtract(ts: TimeSpan): TimeSpan;
    compareTo(value: TimeSpan): 0 | 1 | -1;
    duration(): TimeSpan;
    equals(value: TimeSpan): boolean;
    negate(): TimeSpan;
    days(): number;
    hours(): number;
    milliseconds(): number;
    seconds(): number;
    ticks(): number;
    totalDays(): number;
    totalHours(): number;
    totalMilliseconds(): number;
    totalMinutes(): number;
    totalSeconds(): number;
    static fromTicks(value: number): TimeSpan;
    static readonly zero: TimeSpan;
    static readonly maxValue: TimeSpan;
    static readonly minValue: TimeSpan;
    static isTimeSpan(timespan: TimeSpan): number;
    static additionDoesOverflow(a: number, b: number): boolean;
    static subtractionDoesUnderflow(a: number, b: number): boolean;
    static compare(t1: TimeSpan, t2: TimeSpan): 0 | 1 | -1;
    static interval(value: number, scale: number): TimeSpan;
    static fromMilliseconds(value: number): TimeSpan;
    static fromSeconds(value: number): TimeSpan;
    static fromMinutes(value: number): TimeSpan;
    static fromHours(value: number): TimeSpan;
    static fromDays(value: number): TimeSpan;
}

declare type TokenProvider = (requestInfo: RequestInfo) => Promise<string>;

export declare class Trigger {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    readonly url: string;
    constructor(container: Container, id: string, clientContext: ClientContext);
    read(options?: RequestOptions): Promise<TriggerResponse>;
    replace(body: TriggerDefinition, options?: RequestOptions): Promise<TriggerResponse>;
    delete(options?: RequestOptions): Promise<TriggerResponse>;
}

export declare interface TriggerDefinition {
    id?: string;
    body: (() => void) | string;
    triggerType: TriggerType;
    triggerOperation: TriggerOperation;
}

export declare enum TriggerOperation {
    All = "all",
    Create = "create",
    Update = "update",
    Delete = "delete",
    Replace = "replace"
}

export declare class TriggerResponse extends ResourceResponse<TriggerDefinition & Resource> {
    constructor(resource: TriggerDefinition & Resource, headers: CosmosHeaders, statusCode: number, trigger: Trigger);
    readonly trigger: Trigger;
}

export declare enum TriggerType {
    Pre = "pre",
    Post = "post"
}

export declare class Triggers {
    readonly container: Container;
    private readonly clientContext;
    constructor(container: Container, clientContext: ClientContext);
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<TriggerDefinition & Resource>;
    create(body: TriggerDefinition, options?: RequestOptions): Promise<TriggerResponse>;
    upsert(body: TriggerDefinition, options?: RequestOptions): Promise<TriggerResponse>;
}

export declare interface UniqueKey {
    paths: string[];
}

export declare interface UniqueKeyPolicy {
    uniqueKeys: UniqueKey[];
}

export declare class User {
    readonly database: Database;
    readonly id: string;
    private readonly clientContext;
    readonly permissions: Permissions;
    readonly url: string;
    constructor(database: Database, id: string, clientContext: ClientContext);
    permission(id: string): Permission;
    read(options?: RequestOptions): Promise<UserResponse>;
    replace(body: UserDefinition, options?: RequestOptions): Promise<UserResponse>;
    delete(options?: RequestOptions): Promise<UserResponse>;
}

export declare class UserDefinedFunction {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    readonly url: string;
    constructor(container: Container, id: string, clientContext: ClientContext);
    read(options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
    replace(body: UserDefinedFunctionDefinition, options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
    delete(options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
}

export declare interface UserDefinedFunctionDefinition {
    id?: string;
    body?: string | (() => void);
}

export declare class UserDefinedFunctionResponse extends ResourceResponse<UserDefinedFunctionDefinition & Resource> {
    constructor(resource: UserDefinedFunctionDefinition & Resource, headers: CosmosHeaders, statusCode: number, udf: UserDefinedFunction);
    readonly userDefinedFunction: UserDefinedFunction;
    readonly udf: UserDefinedFunction;
}

export declare enum UserDefinedFunctionType {
    Javascript = "Javascript"
}

export declare class UserDefinedFunctions {
    readonly container: Container;
    private readonly clientContext;
    constructor(container: Container, clientContext: ClientContext);
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<UserDefinedFunctionDefinition & Resource>;
    create(body: UserDefinedFunctionDefinition, options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
    upsert(body: UserDefinedFunctionDefinition, options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
}

export declare interface UserDefinition {
    id?: string;
}

export declare class UserResponse extends ResourceResponse<UserDefinition & Resource> {
    constructor(resource: UserDefinition & Resource, headers: CosmosHeaders, statusCode: number, user: User);
    readonly user: User;
}

export declare class Users {
    readonly database: Database;
    private readonly clientContext;
    constructor(database: Database, clientContext: ClientContext);
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    readAll(options?: FeedOptions): QueryIterator<UserDefinition & Resource>;
    create(body: UserDefinition, options?: RequestOptions): Promise<UserResponse>;
    upsert(body: UserDefinition, options?: RequestOptions): Promise<UserResponse>;
}

export declare function extractPartitionKey(document: any, partitionKeyDefinition: PartitionKeyDefinition): PartitionKey[];

export declare function setAuthorizationTokenHeaderUsingMasterKey(verb: HTTPMethod, resourceId: string, resourceType: ResourceType, headers: CosmosHeaders, masterKey: string): void;
